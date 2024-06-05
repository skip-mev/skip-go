import { ComponentPropsWithoutRef, useMemo } from "react";

export type AdaptiveLinkProps = ComponentPropsWithoutRef<"a"> & { isExternal?: boolean };

export function AdaptiveLink({ href, isExternal, rel = "", target, ...props }: AdaptiveLinkProps) {
  const isActuallyExternal = useMemo(() => {
    if (typeof isExternal === "boolean") {
      return isExternal;
    }
    if (typeof href === "string") {
      return href.startsWith("http");
    }
  }, [href, isExternal]);

  const externalProps = useMemo(() => {
    if (!isActuallyExternal) return {};
    return {
      rel: mergeRelAttributes("noopener", "noreferrer", rel),
      target: target || "_blank",
    };
  }, [isActuallyExternal, rel, target]);

  return (
    <a
      href={href}
      {...externalProps}
      {...props}
    />
  );
}

function mergeRelAttributes(...args: string[]) {
  return [...new Set(args.join(" ").split(" "))].filter(Boolean).join(" ");
}
