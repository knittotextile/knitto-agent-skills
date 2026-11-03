// lib.mjs — shared helpers for the github-projects scripts: arg parsing,
// `gh api graphql` calls, board/field lookup, issue-ref parsing, and the
// dry-run / --yes gate every write script goes through.
//
// There is no default board: every run names one with --project <URL> (or
// --project <n> --org <org>), or GH_PROJECT_ORG + GH_PROJECT_NUMBER.
// Scripts that rely on the Wave convention check the board has a Wave field
// and point at init-board.mjs when it doesn't.

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

// "https://github.com/orgs/<org>/projects/<n>[/views/..]" or a number + --org.
export function boardConfig(flags) {
  const raw = String(flags.project || process.env.GH_PROJECT_NUMBER || "");
  const m = raw.match(/github\.com\/orgs\/([^/]+)\/projects\/(\d+)/);
  const org = m ? m[1] : flags.org || process.env.GH_PROJECT_ORG;
  const number = Number(m ? m[2] : raw);
  if (!org || !number) {
    throw new Error("board belum ditentukan: berikan --project <URL board> (contoh https://github.com/orgs/<org>/projects/<n>) atau --project <n> --org <org>");
  }
  return { org, number };
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
  return { id: p.id, title: p.title, url: p.url, fields, hasWave: Boolean(fields.wave) };
}

// Wave-convention scripts call this first.
export function requireWave(project) {
  if (project.hasWave) return;
  throw new Error(`board "${project.title}" belum memakai konvensi Wave (tidak ada field Wave). Jalankan: node scripts/init-board.mjs --project ${project.url}`);
}

// Fields every Wave-convention board needs. Application options are the
// board's own; --applications only adds missing ones.
export const WAVE_FIELDS = [
  { name: "Start Date", dataType: "DATE" },
  { name: "Target Date", dataType: "DATE" },
  { name: "Estimate (jam)", dataType: "NUMBER" },
];
export const WAVE_OPTIONS = ["Tracking", "W0", "W1", "W2", "W3", "W4", "W5"];
const PALETTE = ["BLUE", "GREEN", "ORANGE", "PURPLE", "PINK", "YELLOW", "RED"];

function selectOptions(fieldId) {
  return graphql(
    `query($id:ID!){node(id:$id){... on ProjectV2SingleSelectField{options{id name color description}}}}`,
    { id: fieldId },
  ).node.options;
}

// Plan (and later apply) the field changes that put a board on the Wave
// convention. Existing option ids are kept, so item values never change.
// Application options that are still the default GRAY get a distinct color.
export function planConventionFields(project, { applications = [], dropLegacy = false, replaceApplications = false } = {}) {
  const plan = [];
  const ops = [];
  for (const f of WAVE_FIELDS) {
    if (project.fields[baseName(f.name).toLowerCase()]) continue;
    plan.push(`create field ${f.name} (${f.dataType})`);
    ops.push(() => graphql(`mutation($p:ID!,$n:String!,$t:ProjectV2CustomFieldType!){createProjectV2Field(input:{projectId:$p,name:$n,dataType:$t}){clientMutationId}}`,
      { p: project.id, n: f.name, t: f.dataType }));
  }
  const selects = [
    { name: "Wave", wanted: WAVE_OPTIONS, color: (n) => (n === "Tracking" ? "GRAY" : "BLUE") },
    { name: "Application", wanted: applications, color: (n, i) => PALETTE[i % PALETTE.length] },
  ];
  for (const s of selects) {
    const f = project.fields[s.name.toLowerCase()];
    const existing = f ? selectOptions(f.id) : [];
    const replace = s.name === "Application" && replaceApplications && s.wanted.length;
    const names = replace ? s.wanted : [...existing.map((o) => o.name), ...s.wanted.filter((w) => !existing.some((o) => o.name === w))];
    if (!names.length) {
      if (s.name === "Application") plan.push("Application: belum ada opsi — berikan --applications \"App1,App2\"");
      continue;
    }
    // Gray Application options take the palette colors not used yet, so apps stay distinguishable.
    const used = new Set(existing.map((o) => o.color));
    const free = PALETTE.filter((c) => !used.has(c));
    let next = 0;
    const options = names.map((n, i) => {
      const o = existing.find((x) => x.name === n);
      const fresh = () => free.length ? free[next++ % free.length] : s.color(n, i);
      const color = s.name === "Application" && (!o || o.color === "GRAY") ? fresh() : o?.color ?? s.color(n, i);
      return { ...(o ? { id: o.id } : {}), name: n, color, description: o?.description ?? "" };
    });
    const changed = !f || replace || options.some((o) => !o.id || existing.find((x) => x.id === o.id)?.color !== o.color);
    if (!changed) continue;
    plan.push(`${f ? "update" : "create"} field ${s.name}: ${options.map((o) => `${o.name}(${o.color.toLowerCase()})`).join(", ")}`);
    ops.push(() => f
      ? graphql(`mutation($f:ID!,$o:[ProjectV2SingleSelectFieldOptionInput!]){updateProjectV2Field(input:{fieldId:$f,singleSelectOptions:$o}){clientMutationId}}`, { f: f.id, o: options })
      : graphql(`mutation($p:ID!,$n:String!,$o:[ProjectV2SingleSelectFieldOptionInput!]){createProjectV2Field(input:{projectId:$p,name:$n,dataType:SINGLE_SELECT,singleSelectOptions:$o}){clientMutationId}}`, { p: project.id, n: s.name, o: options }));
  }
  for (const legacy of ["delivery stage", "owner"]) {
    const f = project.fields[legacy];
    if (!f || !dropLegacy) continue;
    plan.push(`delete legacy field ${f.name}`);
    ops.push(() => graphql(`mutation($f:ID!){deleteProjectV2Field(input:{fieldId:$f}){clientMutationId}}`, { f: f.id }));
  }
  return { plan, apply: () => ops.forEach((op) => op()) };
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
      assignees(first:10){nodes{login}}
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
            ... on Issue{number title url state body repository{nameWithOwner} assignees(first:10){nodes{login}}
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
        title: (c.title ?? "").trim(),
        url: c.url ?? null,
        state: c.state ?? null,
        body: c.body ?? "",
        repo: c.repository?.nameWithOwner ?? null,
        number: c.number ?? null,
        key: c.repository ? `${c.repository.nameWithOwner}#${c.number}`.toLowerCase() : null,
        parent: c.parent ? `${c.parent.repository.nameWithOwner}#${c.parent.number}` : null,
        subIssueCount: c.subIssues?.totalCount ?? 0,
        assignees: (c.assignees?.nodes ?? []).map((a) => a.login),
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

export const TITLE_RE = /^\[(W\d+)(-follow-up|-lanjutan)?\]\s+\S/;

// Copy a project (views, fields, workflows, README; no items) into the same org.
export function copyProject(org, fromNumber, title) {
  const d = graphql(
    `query($org:String!,$n:Int!){organization(login:$org){id projectV2(number:$n){id}}}`,
    { org, n: fromNumber },
  );
  const c = graphql(
    `mutation($p:ID!,$o:ID!,$t:String!){copyProjectV2(input:{projectId:$p,ownerId:$o,title:$t,includeDraftIssues:false}){projectV2{number url}}}`,
    { p: d.organization.projectV2.id, o: d.organization.id, t: title },
  );
  return c.copyProjectV2.projectV2;
}

// Add assignees (GitHub logins) to an issue; Assignees replace the old Owner text field.
export function addAssignees(ref, logins) {
  if (!logins.length) return;
  gh(["issue", "edit", String(ref.number), "--repo", `${ref.owner}/${ref.repo}`, "--add-assignee", logins.join(",")]);
}

export const splitLogins = (s) => String(s ?? "").split(",").map((x) => x.trim().replace(/^@/, "")).filter(Boolean);

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
