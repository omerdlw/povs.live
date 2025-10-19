export function createNavItem(type, data) {
  switch (type) {
    case "skeleton": {
      return {
        description: "please wait",
        name: "loading",
        href: "loading",
        skeleton: true,
        icon: "...",
      };
    }
    default:
      return null;
  }
}
