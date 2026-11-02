// lib.mjs — shared helpers for the github-projects scripts: arg parsing,
// `gh api graphql` calls, board/field lookup, issue-ref parsing, and the
// dry-run / --yes gate every write script goes through.
//
// Board defaults to org `knittotextile` project #15 ("Knitto SDLC").
// Override with --org / --project, or GH_PROJECT_ORG / GH_PROJECT_NUMBER.

import { execFileSync } from "node:child_process";

export function parseArgs(argv = process.argv.slice(2)) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { positional.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else { flags[key] = next; i++; }
  }
  return { flags, positional };
}

export function boardConfig(flags) {
  return {
    org: flags.org || process.env.GH_PROJECT_ORG || "knittotextile",
    number: Number(flags.project || process.env.GH_PROJECT_NUMBER || 15),
  };
}

export function gh(args, input) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: ["pipe", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  });
}

export function graphql(query, variables = {}) {
  const out = gh(
    ["api", "graphql", "-H", "GraphQL-Features: sub_issues", "--input", "-"],
    JSON.stringify({ query, variables }),
  );
  const res = JSON.parse(out);
  if (res.errors?.length) throw new Error(res.errors.map((e) => e.message).join("; "));
  return res.data;
}

// "owner/repo#12", "https://github.com/owner/repo/issues/12", or "#12" with defaultRepo.
export function parseIssueRef(ref, defaultRepo = null) {
  const s = String(ref).trim();
  let m = s.match(/github\.com\/([^/]+)\/([^/]+)\/(?:issues|pull)\/(\d+)/);
  if (m) return { owner: m[1], repo: m[2], number: Number(m[3]) };
  m = s.match(/^([\w.-]+)\/([\w.-]+)#(\d+)$/);
  if (m) return { owner: m[1], repo: m[2], number: Number(m[3]) };
  m = s.match(/^#?(\d+)$/);
  if (m && defaultRepo) {
    const [owner, repo] = defaultRepo.split("/");
    return { owner, repo, number: Number(m[1]) };
  }
  throw new Error(`Unrecognized issue ref "${ref}" (use owner/repo#n or an issue URL)`);
}

export const refKey = (r) => `${r.owner}/${r.repo}#${r.number}`.toLowerCase();

// "Estimate (jam)" -> "Estimate": fields may carry a unit suffix on the board.
export const baseName = (name) => name.replace(/\s*\([^)]*\)\s*$/, "");

export function getProject({ org, number }) {
  const data = graphql(
    `query($org:String!,$n:Int!){organization(login:$org){projectV2(number:$n){
      id title url
      fields(first:50){nodes{
        ... on ProjectV2FieldCommon{id name dataType}
        ... on ProjectV2SingleSelectField{options{id name}}
      }}
    }}}`,
    { org, n: number },
  );
  const p = data.organization?.projectV2;
  if (!p) throw new Error(`Project ${org}#${number} not found (check gh auth has the project scope)`);
  const fields = {};
  for (const f of p.fields.nodes) if (f?.name) fields[baseName(f.name).toLowerCase()] = f;
  return { id: p.id, title: p.title, url: p.url, fields };
}

export function field(project, name) {
  const f = project.fields[name.toLowerCase()];
  if (!f) throw new Error(`Board "${project.title}" has no field "${name}"`);
  return f;
}

// Build the `value` input for updateProjectV2ItemFieldValue from a plain string.
export function fieldValue(project, name, raw) {
  const f = field(project, name);
  if (f.dataType === "SINGLE_SELECT") {
    const opt = f.options.find((o) => o.name.toLowerCase() === String(raw).toLowerCase());
    if (!opt) throw new Error(`"${raw}" is not an option of ${f.name} (options: ${f.options.map((o) => o.name).join(", ")})`);
    return { field: f, value: { singleSelectOptionId: opt.id }, label: opt.name };
  }
  if (f.dataType === "NUMBER") {
    const n = Number(raw);
    if (Number.isNaN(n)) throw new Error(`${f.name} expects a number, got "${raw}"`);
    return { field: f, value: { number: n }, label: String(n) };
  }
  if (f.dataType === "DATE") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error(`${f.name} expects YYYY-MM-DD, got "${raw}"`);
    return { field: f, value: { date: raw }, label: raw };
  }
  return { field: f, value: { text: String(raw) }, label: String(raw) };
}

export function getIssue(ref) {
  const data = graphql(
    `query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){issue(number:$n){
      id number title url state body
      parent{number repository{nameWithOwner}}
      projectItems(first:20){nodes{id project{id}}}
    }}}`,
    { o: ref.owner, r: ref.repo, n: ref.number },
  );
  const issue = data.repository?.issue;
  if (!issue) throw new Error(`Issue ${refKey(ref)} not found`);
  return issue;
}

export function itemIdFor(issue, project) {
  return issue.projectItems.nodes.find((n) => n.project.id === project.id)?.id ?? null;
}

export function addToProject(project, contentId) {
  const d = graphql(
    `mutation($p:ID!,$c:ID!){addProjectV2ItemById(input:{projectId:$p,contentId:$c}){item{id}}}`,
    { p: project.id, c: contentId },
  );
  return d.addProjectV2ItemById.item.id;
}

export function setField(project, itemId, fv) {
  graphql(
    `mutation($p:ID!,$i:ID!,$f:ID!,$v:ProjectV2FieldValue!){
      updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:$v}){projectV2Item{id}}}`,
    { p: project.id, i: itemId, f: fv.field.id, v: fv.value },
  );
}

export function addSubIssue(parentId, childId) {
  graphql(
    `mutation($p:ID!,$c:ID!){addSubIssue(input:{issueId:$p,subIssueId:$c}){issue{id}}}`,
    { p: parentId, c: childId },
  );
}

// Every board item with its field values flattened to { fieldName: value }.
export function getItems(project) {
  const items = [];
  let after = null;
  do {
    const d = graphql(
      `query($id:ID!,$after:String){node(id:$id){... on ProjectV2{items(first:100,after:$after){
        pageInfo{hasNextPage endCursor}
        nodes{id
          fieldValues(first:30){nodes{
            ... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2FieldCommon{name}}}
            ... on ProjectV2ItemFieldTextValue{text field{... on ProjectV2FieldCommon{name}}}
            ... on ProjectV2ItemFieldNumberValue{number field{... on ProjectV2FieldCommon{name}}}
            ... on ProjectV2ItemFieldDateValue{date field{... on ProjectV2FieldCommon{name}}}
          }}
          content{
            ... on Issue{number title url state body repository{nameWithOwner}
              parent{number repository{nameWithOwner}} subIssues{totalCount}}
            ... on DraftIssue{title body}
          }
        }}}}}`,
      { id: project.id, after },
    );
    const page = d.node.items;
    for (const n of page.nodes) {
      const values = {};
      for (const v of n.fieldValues.nodes) {
        if (!v?.field?.name) continue;
        values[baseName(v.field.name)] = v.name ?? v.text ?? v.number ?? v.date ?? null;
      }
      const c = n.content || {};
      items.push({
        itemId: n.id,
        values,
        draft: !c.repository,
        title: c.title ?? "",
        url: c.url ?? null,
        state: c.state ?? null,
        body: c.body ?? "",
        repo: c.repository?.nameWithOwner ?? null,
        number: c.number ?? null,
        key: c.repository ? `${c.repository.nameWithOwner}#${c.number}`.toLowerCase() : null,
        parent: c.parent ? `${c.parent.repository.nameWithOwner}#${c.parent.number}` : null,
        subIssueCount: c.subIssues?.totalCount ?? 0,
      });
    }
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return items;
}

// Parse the header line `Wave: W1 | Parent: o/r#n | Repo: o/r | Branch: ... | Depends: ...`.
export function parseHeader(body = "") {
  const line = body.split(/\r?\n/).find((l) => /^\s*Wave\s*:/i.test(l)) || "";
  const out = {};
  for (const part of line.split("|")) {
    const m = part.match(/^\s*([\w ]+?)\s*:\s*(.*?)\s*$/);
    if (m) out[m[1].toLowerCase()] = m[2];
  }
  return out;
}

export function parseDepends(body, ownRepo) {
  const raw = parseHeader(body).depends;
  if (!raw || /^-?$|^none$/i.test(raw.trim())) return [];
  return raw
    .split(/[,\s]+/)
    .filter((t) => /#\d+|\/issues\/\d+/.test(t))
    .map((t) => parseIssueRef(t.replace(/[()]/g, ""), ownRepo));
}

export const waveRank = (w) => {
  const m = String(w ?? "").match(/^W(\d+)$/i);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
};

export const TITLE_RE = /^\[(W\d+)(-lanjutan)?\]\s+\S/;

// Write gate: without --yes, print the plan and exit 0.
export function confirmOrExit(flags, lines) {
  console.log((flags.yes ? "Executing:" : "Dry run (add --yes to execute):"));
  for (const l of lines) console.log(`  - ${l}`);
  if (!flags.yes) process.exit(0);
}

export function run(main) {
  try {
    main();
  } catch (e) {
    console.error(`error: ${e.stderr?.toString().trim() || e.message}`);
    process.exit(1);
  }
}
