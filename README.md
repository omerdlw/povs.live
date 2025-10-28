# My Web Base Project

This `BASE` folder contains a clean, organized, and optimized starting point for building new projects based on the architecture of `my-web`.

## How to Use

To start a new project using this base, follow these steps:

1.  **Copy the `BASE` folder:** Make a copy of this `BASE` folder and rename it to your new project's name.

2.  **Install dependencies:** Navigate to your new project's directory and run `npm install` or `yarn install` to install the required packages.

3.  **Start the development server:** Run `npm run dev` or `yarn dev` to start the Next.js development server.

4.  **Customize:** You can now start building your new project by:
    *   Adding new pages in the `app/(views)` directory.
    *   Creating new components in the `components` directory.
    *   Adding new contexts, hooks, and utility functions as needed.

## Project Structure

The `BASE` project has the following structure:

```
BASE/
├───app/                  # Core app structure (layout, providers, global styles)
├───components/           # Reusable UI components (controls, modal, nav, shared)
├───config/               # Application-wide constants
├───contexts/             # Core React contexts (Modal, Navigation, Settings)
├───hooks/                # Core custom hooks (useComponentSize, useNavigation, useNavItem)
├───lib/                  # Utility functions
├───.gitignore            # Git ignore file
├───jsconfig.json         # JS configuration for aliases
├───next.config.mjs       # Next.js configuration
├───package.json          # Project dependencies and scripts
├───postcss.config.mjs    # PostCSS configuration
└───tailwind.config.js    # Tailwind CSS configuration
```

## Available Components

-   **`ControlsButton`**: A versatile button component.
-   **`Icon`**: A wrapper for using icons from Iconify.
-   **`Modal`**: A complete modal system with a context-based API.
-   **`Nav`**: A stack-based navigation system.
-   **`Loading`**, **`Error`**, **`skeletons`**: Shared components for displaying different states.

## Available Contexts

-   **`ModalContext`**: For opening and closing modals from anywhere in the app.
-   **`NavigationContext`**: Manages the state of the navigation system.
-   **`SettingsContext`**: Manages app-wide settings like the theme.

## Available Hooks

-   **`useComponentSize`**: A hook to measure the size of a component.
-   **`useNavigation`**: Provides all the logic for the navigation system.
-   **`useNavItem`**: A factory hook to create navigation items.

## Extending the Base

To add new features, you can follow the patterns established in the `my-web` project:

-   **Feature-specific components:** Create a new folder in `components` for your feature (e.g., `components/my-feature`).
-   **Feature-specific contexts:** Create a new context in `contexts` (e.g., `my-feature-context.js`) and add it to the `AppProviders` in `app/providers.js`.
-   **API routes:** Create new API routes in the `app/api` directory.
-   **Pages:** Create new pages in the `app/(views)` directory.

Happy coding!
