# TODO App UI Guidelines

## Purpose

The TODO app should feel focused, calm, and quick to use. The primary workflow is to add a task, scan the current task list, and remove tasks that are no longer needed. The interface should support that workflow without unnecessary navigation or decoration.

## Technology and Component Approach

- Use Tailwind CSS for layout, spacing, responsive behavior, typography, color, focus states, and theme variants.
- Use Untitled UI components and patterns as the visual foundation. Prefer their accessible form controls, buttons, alerts, and surface styles over one-off components.
- Keep component styling composable through Tailwind class names. Avoid introducing a second styling system or page-specific CSS unless a reusable visual treatment cannot be expressed with the existing design tokens.
- Use semantic HTML and accessible names for every control. Interactive elements must be keyboard accessible and show a visible focus ring.

## Page Structure

The main view is a centered, responsive workspace:

1. **App header**
   - Show the product title, `To Do App`, and the supporting text, `Keep track of your tasks`.
   - Include the light/dark theme toggle in the header. The control needs an accessible label and should indicate the active theme.
2. **Add task section**
   - Use an Untitled UI-style field with the label `Add new item` and a text input.
   - The input and `Add item` button should sit in one row on larger screens and stack on small screens.
   - Disable submission for blank or whitespace-only values. Preserve the input value if submission fails.
3. **Task list section**
   - Use a clear section heading such as `Items from database`.
   - Render each task as a row with the task name and a destructive `Delete` action.
   - Keep row height, alignment, and button placement stable as task names change. Long names should wrap rather than overflow.

The content column should use a readable maximum width, consistent horizontal padding, and a vertical spacing scale based on Tailwind spacing tokens. The layout must remain usable at mobile widths without horizontal scrolling.

## States and Feedback

The task list must explicitly support these states:

- **Loading:** show an Untitled UI-style skeleton or progress indicator in the list region while data is fetched.
- **Loaded with tasks:** show the task rows in a semantic list.
- **Empty:** show `No items found. Add some!` with enough context to make the next action obvious.
- **Error:** show an inline alert with a concise message and, where applicable, a retry action. Do not hide already loaded tasks when a later mutation fails.
- **Submitting or deleting:** show a pending state on the active control, prevent duplicate requests, and retain clear focus behavior.
- **Success:** add a newly created task immediately after the API confirms it. Remove a deleted task only after deletion succeeds.

Use color, text, and iconography together for status communication. Never rely on color alone. Destructive actions should use the Untitled UI destructive button treatment and require a clear accessible label.

## Tailwind Design Tokens

Use a small, consistent palette mapped to Tailwind semantic roles:

- `bg-background` and `text-foreground` for the application shell.
- `bg-card`, `border-border`, and `text-muted-foreground` for sections and supporting content.
- `bg-primary` and `text-primary-foreground` for the main add action.
- `bg-destructive` and `text-destructive-foreground` for delete actions and critical errors.
- `ring-ring` for keyboard focus indicators.

Prefer spacing, radius, and typography values from the configured Tailwind theme. Use restrained borders and shadows; surfaces should separate content without making every element look like a floating card. Keep button and input heights consistent across the page.

## Light and Dark Theme

Implement theming with Tailwind's `darkMode: 'class'` strategy:

- Put the `dark` class on the root HTML element when dark mode is active.
- Define light and dark semantic color tokens rather than hard-coding separate component colors.
- Apply `dark:` variants to the page background, text, borders, surfaces, inputs, alerts, and button states.
- On first load, use the user's persisted preference when available; otherwise respect `prefers-color-scheme`.
- Store the user's explicit selection so it remains after reload.
- Keep contrast accessible in both themes, including hover, disabled, error, and focus states.
- Avoid theme changes that move or resize content. The toggle should update appearance without disrupting the current task list or input value.

The theme toggle should offer three choices if system preference is supported: Light, Dark, and System. If the product only exposes a binary control, label it with the destination state, for example `Switch to dark mode`, and update the label after activation.

## Accessibility and Interaction

- Use a real `<form>` for adding tasks and submit it with Enter.
- Associate every input with a visible label; placeholders are hints, not labels.
- Use `aria-live="polite"` for loading and mutation feedback, and `role="alert"` for actionable errors.
- Keep focus visible with a high-contrast `focus-visible:ring-2` treatment.
- Ensure text and controls meet WCAG AA contrast requirements in both themes.
- Do not use hover-only actions. Delete must remain available to keyboard and touch users.
- Provide a sufficiently large touch target for buttons, with at least 44px of usable height where practical.

## Responsive Behavior

- Mobile: stack the add-task input and button, use full-width controls, and allow task names to wrap.
- Tablet and desktop: keep the workspace centered and constrain line length; place the input and primary action on one line.
- Maintain consistent section order and heading hierarchy at every breakpoint.
- Test the page at narrow mobile, standard desktop, and increased text-size settings before release.

## Visual Quality Checklist

- The add-task action is the strongest visual action on the page.
- Delete is visibly secondary and clearly destructive.
- Loading, empty, and error states occupy the same list region without layout jumps.
- Light and dark themes both feel intentional rather than being simple color inversions.
- Focus, hover, disabled, and pending states are implemented for every interactive control.
- Tailwind and Untitled UI conventions remain consistent across future screens.