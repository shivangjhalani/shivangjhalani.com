import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"


// consts
const tagsToRemove = ["graph-exclude", "explorer-exclude", "backlinks-exclude", "recents-exclude", "search-exclude"]
const graphConfig = {
  localGraph: {
    removeTags: tagsToRemove,
    excludeTags: ["graph-exclude"]
  },
  globalGraph: {
    removeTags: tagsToRemove,
    excludeTags: ["graph-exclude"]
  }
};

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/shivangjhalani",
      "Linkedin": "https://www.linkedin.com/in/shivang-jhalani/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
    Component.FloatingButtons({position: 'right'}),
  ],
  right: [
    Component.Graph(graphConfig),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  afterBody: [
    Component.RecentNotes({
      limit: 3,
      title: "Recent",
      linkToMore: "tags"
    })
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.DesktopOnly(Component.RecentNotes({
      limit: 3,
      title: "Recent",
      linkToMore: "tags"
    })),
    Component.HiddenGlobalGraph(graphConfig),
  ],
}
