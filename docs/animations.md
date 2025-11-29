## UI Animation Enhancements

🎨 Overview

This repo received a set of visual polish and animation improvements across core UI components to make the experience more lively and delightful:

- A new `Animated` helper component (src/components/ui/animated.tsx) centralizes entrance animations and optional delays.
- `Card` components now include a subtle entrance animation and hover lift/scale to add depth.
- `Button` variants have smooth micro-interactions (hover/active scale) and motion-safe transforms.
- `SidebarNav` icons and links have improved hover transforms and an active indicator for clearer navigation.
- Dashboard & AI Tutor pages include staggered entrance animations for cards and list rows.

💡 How to use

- Wrap any element with the `Animated` component or add `className` like `animate-fade-in` and `delay-150`.

Example:

```tsx
import { Animated } from '@/components/ui/animated'

<Animated className="delay-100">
  <Card>...</Card>
</Animated>
```

Notes
- Animations use Tailwind CSS's animation utilities and `tailwindcss-animate` which is already configured.
- All changes were validated by TypeScript type-check and a Next.js production build in this environment. Some server actions may still expect Firebase config for fully integrated runtime verification.
