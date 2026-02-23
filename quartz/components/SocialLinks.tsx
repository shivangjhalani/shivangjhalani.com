import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/socialLinks.scss"
import { classNames } from "../util/lang"

export type SocialPlatform = "linkedin" | "twitter" | "github" | "resume" | "email"

export interface SocialLink {
  platform: SocialPlatform
  href: string
  label?: string
  ariaLabel?: string
  newTab?: boolean
}

export interface SocialLinksOptions {
  links: SocialLink[]
  variant?: "icon-only" | "icon-label"
  size?: "sm" | "md" | "lg"
  direction?: "row" | "column"
  wrap?: boolean
  gap?: string
  title?: string
  tightY?: boolean
}

const defaultOptions: Omit<SocialLinksOptions, "links"> = {
  variant: "icon-only",
  size: "md",
  direction: "row",
  wrap: true,
  gap: "0.6rem",
  tightY: false,
}

const defaultLabels: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  github: "GitHub",
  resume: "Resume",
  email: "Email",
}

function socialIcon(platform: SocialPlatform) {
  switch (platform) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect x="2" y="9" width="4" height="12" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      )
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 4h4.8l4 5.5L17.9 4H20l-6.2 7.5L20.5 20h-4.8l-4.3-5.8L6.1 20H4l6.5-7.9z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )
    case "github":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.88 1.52 2.32 1.08 2.88.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.96 0-1.1.39-2 1.03-2.71-.1-.25-.45-1.27.1-2.64 0 0 .85-.27 2.78 1.03A9.6 9.6 0 0 1 12 6.83a9.6 9.6 0 0 1 2.53.34c1.93-1.3 2.77-1.03 2.77-1.03.56 1.37.2 2.39.1 2.64.64.71 1.03 1.61 1.03 2.71 0 3.86-2.35 4.71-4.58 4.95.36.32.68.95.68 1.93v2.86c0 .27.18.58.69.48A10 10 0 0 0 12 2z"
            fill="currentColor"
          />
        </svg>
      )
    case "resume":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M14 2v5h5" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9 13h6M9 17h6M9 9h2" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
      )
    case "email":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="m4 7 8 6 8-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}

function opensInNewTab(link: SocialLink) {
  if (typeof link.newTab === "boolean") {
    return link.newTab
  }

  return !link.href.startsWith("mailto:")
}

export default ((userOpts: SocialLinksOptions) => {
  const opts = { ...defaultOptions, ...userOpts }

  const SocialLinks: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    if (!opts.links.length) {
      return null
    }

    const rootClass = classNames(
      displayClass,
      "social-links",
      opts.variant!,
      opts.size!,
      opts.tightY ? "tight-y" : "",
    )
    const rootStyle = `flex-direction: ${opts.direction}; flex-wrap: ${opts.wrap ? "wrap" : "nowrap"}; gap: ${opts.gap};`

    return (
      <nav class={rootClass} style={rootStyle} aria-label={opts.title ?? "Social links"}>
        {opts.links.map((link) => {
          const label = link.label ?? defaultLabels[link.platform]
          const newTab = opensInNewTab(link)
          return (
            <a
              key={`${link.platform}:${link.href}`}
              class={`social-link social-${link.platform}`}
              href={link.href}
              aria-label={link.ariaLabel ?? label}
              title={label}
              target={newTab ? "_blank" : undefined}
              rel={newTab ? "noopener noreferrer" : undefined}
            >
              <span class="social-link-icon">{socialIcon(link.platform)}</span>
              {opts.variant === "icon-label" && <span class="social-link-label">{label}</span>}
            </a>
          )
        })}
      </nav>
    )
  }

  SocialLinks.css = style
  return SocialLinks
}) satisfies QuartzComponentConstructor<SocialLinksOptions>

