export type CapabilityIconKind = 'design' | 'motion' | 'architecture';

export interface Capability {
  id: string;
  /** Rendered on two lines. */
  title: readonly [string, string];
  description: string;
  tags: string;
  icon: CapabilityIconKind;
}

export const capabilities: readonly Capability[] = [
  {
    id: '01',
    title: ['TACTICAL', 'UI DESIGN'],
    description:
      'No templates. No compromises. Bespoke, high-precision interfaces built to make your brand impossible to ignore.',
    tags: 'UI/UX DESIGN · ART DIRECTION',
    icon: 'design',
  },
  {
    id: '02',
    title: ['KINETIC', 'ENGINE'],
    description:
      'Static is not in our vocabulary. Immersive motion and 3D web experiences, engineered for unapologetic speed.',
    tags: 'GSAP · WEBGL · CREATIVE DEV',
    icon: 'motion',
  },
  {
    id: '03',
    title: ['HIGH-CONVERSION', 'ARCHITECTURE'],
    description:
      'Good looks. Serious results. Strategic layout systems that turn first impressions into meaningful action.',
    tags: 'STRATEGY · DEVELOPMENT · SEO',
    icon: 'architecture',
  },
];
