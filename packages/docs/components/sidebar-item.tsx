"use client";

import type { PageTree } from "fumadocs-core/server";
import {
  SidebarItem as InternalSidebarItem,
  SidebarSeparator as InternalSidebarSeparator,
} from "fumadocs-ui/layouts/docs/sidebar";

export const SidebarItem = ({
  item,
}: {
  item: PageTree.Item;
}) => {
  const name = `${item.name}`;
  const isCode = name.startsWith("`") && name.endsWith("`");
  const tagMatch = name.match(/#(\w+)$/);
  const tag = tagMatch ? tagMatch[1] : null;
  const cleanName = tagMatch ? name.replace(/#\w+$/, "").trim() : name;

  return (
    <InternalSidebarItem key={item.url} href={item.url} external={item.external} icon={item.icon}>
      {isCode ? (
        <code className="bg-[#00000010] dark:bg-[#ffffff10] px-1.5 py-0.5 rounded-[3px]">{cleanName.slice(1, -1)}</code>
      ) : (
        <>
          {cleanName}
          {tag && (
            <span className="ml-0 mb-[-1px] text-xs px-1.5 py-0.5 bg-[#00000010] dark:bg-[#ffffff10] rounded-md">
              {"💎 " + tag}
            </span>
          )}
        </>
      )}
    </InternalSidebarItem>
  );
};

export const SidebarSeparator = ({
  item,
}: {
  item: PageTree.Separator;
}) => {
  return (
    <InternalSidebarSeparator
      className={"mt-8 text-lg tracking-wide dark:text-white"}
      style={{ fontVariant: "all-petite-caps" }}
    >
      {item.icon}
      {item.name}
    </InternalSidebarSeparator>
  );
};
