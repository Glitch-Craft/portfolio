import type { SectionId } from '@/components/section-link';
import { publicEnv } from '@/lib/env';

export const siteConfig = {
  name: 'Glitch Craft',
  title: 'Glitch Craft® — Built Different. By Design.',
  description:
    'Glitch Craft is an independent digital studio crafting bespoke websites, tactical interfaces, and high-performance interactive experiences. Built different. By design.',
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  email: 'hello@glitchcraft.studio',
  themeColor: '#0f1923',
} as const;

/** Home page sections linked from the header. */
export const navigation: readonly { index: string; label: string; section: SectionId }[] = [
  { index: '01', label: 'THE STUDIO', section: 'manifesto' },
  { index: '02', label: 'CAPABILITIES', section: 'capabilities' },
  { index: '03', label: 'CONTACT', section: 'contact' },
];

export const socialLinks = [
  { name: 'TWITTER / X', href: 'https://x.com' },
  { name: 'GITHUB', href: 'https://github.com' },
  { name: 'LINKEDIN', href: 'https://linkedin.com' },
  { name: 'DISCORD', href: 'https://discord.com' },
] as const;
