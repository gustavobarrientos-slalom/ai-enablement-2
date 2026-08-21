# Coding Guidelines

## General Principles

- Keep changes focused on the requested behavior and preserve existing public APIs unless a contract change is required.
- Prefer clear, boring code over clever abstractions. Name variables, functions, and components for the behavior they represent.
- Follow the DRY principle: keep one source of truth for rules, transformations, and shared UI behavior. Extract a helper or component when duplication would make future changes easy to miss.
- Do not abstract one-off code prematurely. Duplication is acceptable when the duplicated behavior is not yet stable or the abstraction would obscure the intent.
- Fix root causes, handle expected errors, and avoid unrelated refactors in the same change.
- Use comments sparingly for non-obvious decisions or constraints, not to narrate straightforward code.

## Formatting

- Use two spaces for indentation and keep lines readable without introducing unnecessary wrapping.
- Use semicolons and single quotes in JavaScript, matching the existing codebase.
- Use trailing commas where the surrounding file and formatter style support them.
- Use `const` by default and `let` only when a binding must change. Avoid `var`.
- Use strict equality (`===` and `!==`) unless a deliberate coercion is documented.
- Prefer early returns for validation and error paths when they make the main flow easier to follow.
- Keep functions small and cohesive. A function should have one clear responsibility.
- Preserve existing formatting in files you are not otherwise changing; do not reformat unrelated code.
- Use ASCII for new source and documentation text unless non-ASCII content is required by the product.

## Imports and Module Boundaries

Organize imports in this order:

1. Node.js built-ins, such as `path` or `fs`.
2. External packages, such as `express` or `react`.
3. Internal application modules and components.
4. Stylesheets and other side-effect imports, where applicable.

Separate groups with a blank line. Keep imports at the top of the file, remove unused imports, and use the existing module system for that package. Backend files currently use CommonJS (`require` and `module.exports`); frontend files use the React app's existing import/export style. Do not mix module systems in one package without an explicit configuration change.

Import the narrowest module or symbol needed. Avoid adding a new dependency for a small utility that can be expressed clearly with the standard library or an existing project dependency.

## React and Frontend Code

- Keep components focused on one view or interaction and extract reusable behavior when it appears in more than one place.
- Use semantic HTML and accessible labels, roles, and names before reaching for custom attributes.
- Keep network and asynchronous state explicit: loading, success, empty, and error states should be represented intentionally.
- Prefer user-visible behavior in component tests over assertions about implementation details.
- Keep styling consistent with the documented Tailwind CSS and Untitled UI direction when those technologies are introduced.

## Backend Code

- Keep route handlers responsible for HTTP concerns and move reusable domain or persistence logic into focused helpers when it grows beyond the handler.
- Validate request input at the API boundary and return consistent status codes and JSON error shapes.
- Use parameterized database queries; never concatenate user input into SQL.
- Handle expected failures with an appropriate response and log enough context to diagnose unexpected failures without exposing sensitive data.
- Close database and server resources in tests and other short-lived processes.

## Linter and Validation Usage

The frontend declares the `react-app` and `react-app/jest` ESLint configurations through `react-scripts`. The repository currently has no standalone root `lint` script. Use the existing validation commands:

- Run `npm run build --workspace=frontend` to perform a production build and catch frontend ESLint and compilation errors.
- Run `npm test` for the frontend and backend unit suites.
- Run `npm run test:all` when a change affects shared behavior or a complete user workflow.

Treat lint warnings as issues to understand and resolve when they concern changed code. Do not disable a rule inline merely to silence it. If an exception is genuinely required, keep it narrowly scoped and explain the reason in the code or pull request. When adding a new lint tool or root lint script, update this guide and the package scripts together.

## Change Review Checklist

- The implementation follows existing package conventions and keeps its scope focused.
- Repeated logic has been intentionally shared or justified as a stable one-off.
- Imports are grouped, ordered, and free of unused entries.
- Frontend build validation and relevant tests pass.
- New error paths and user-visible states have coverage where applicable.
- No secrets, generated artifacts, or unrelated formatting changes are included.