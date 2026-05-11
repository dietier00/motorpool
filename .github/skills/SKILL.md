---
name: skills
description: "Use when designing or reviewing React components. Applies the component design rules: single responsibility, controlled inputs, pure components, composition over configuration, and a 250-line file limit."
argument-hint: "Review or design a React component"
---

# Component Design Guidelines

## When to Use
- Designing a new React component.
- Reviewing an existing component for refactoring opportunities.
- Splitting a large component into smaller parts.
- Deciding between props, children, slots, or extracted subcomponents.

## Workflow
1. Identify the component's actual responsibility.
2. Check whether the component fetches data, transforms data, and renders a complex UI in the same file.
3. If it does more than one job, split it into a container, helper hook, or smaller presentational components.
4. Decide whether the component is controlled or uncontrolled.
5. For forms with multiple inputs, prefer controlled components unless there is a clear reason not to.
6. If the component only depends on props, keep it pure and avoid hidden side effects.
7. Prefer composition over configuration.
8. Use `children` or slot-like props before adding many boolean flags.
9. Check the file length.
10. If the component file is longer than 250 lines, extract subcomponents or supporting logic.

## Design Rules
- Single responsibility: one component should do one thing well.
- Controlled vs uncontrolled: use controlled components for forms that coordinate several inputs.
- Pure components: prop-only components should remain predictable and side-effect free.
- Composition over configuration: prefer structure and composition instead of many render flags.
- Size limit: keep component files at or under 250 lines when practical.

## Review Checklist
- The component has one clear purpose.
- Data fetching and rendering are separated when both are needed.
- Multi-input forms are controlled unless there is a strong reason not to be.
- Prop-only components are written as pure functions.
- Conditional variants are handled with composition, not excessive boolean props.
- The file stays within the 250-line limit, or supporting pieces have been extracted.

## Completion Criteria
- The component structure is easy to scan.
- Responsibilities are split into the smallest sensible units.
- The API is simple to consume.
- The file can be maintained without adding more flags or layers of branching.