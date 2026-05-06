import { Badge } from "@avivox-workspace/ui/badge";
import { Card } from "@avivox-workspace/ui/card";
import { Container } from "@avivox-workspace/ui/container";
import { Heading } from "@avivox-workspace/ui/heading";
import { Section } from "@avivox-workspace/ui/section";
import { Text } from "@avivox-workspace/ui/text";

import { architectureCards, architectureHighlights } from "../../lib/content";

export default function ArchitecturePage() {
  return (
    <main className='bg-white'>
      {/* Hero */}
      <Section className='border-b border-zinc-200 bg-white'>
        <Container>
          <div className='py-16 sm:py-24 lg:py-32'>
            <div className='mx-auto max-w-3xl text-center'>
              <Badge className='justify-center' variant='light'>
                Architecture
              </Badge>
              <Heading className='mt-8'>Monorepo structure for scale</Heading>
              <Text size='lg' className='mt-8 text-center'>
                A clear separation between application code, shared components, and configuration ensures teams can move independently while staying aligned.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Packages */}
      <Section className='border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Core packages</Heading>
            </div>
            <div className='grid gap-6 lg:grid-cols-2'>
              {architectureCards.map((card) => (
                <Card key={card.title} title={card.title} description={card.description} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Design Philosophy */}
      <Section className='bg-zinc-50 border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Design philosophy</Heading>
            </div>
            <div className='grid gap-10 lg:grid-cols-3'>
              {architectureHighlights.map((item) => (
                <div key={item.title} className='space-y-4'>
                  <div className='h-12 w-12 rounded-lg bg-black' />
                  <h3 className='text-lg font-bold text-black'>{item.title}</h3>
                  <Text size='sm' className='text-black'>
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Component System */}
      <Section className='bg-white'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <Heading level={2}>Component library strategy</Heading>
            <Text className='mt-6'>
              All reusable UI is built once in <code className='text-xs font-bold text-black bg-zinc-200 px-2.5 py-1.5 rounded-md inline'>packages/ui</code> and consumed across the workspace. This
              maintains consistency in spacing, typography, and interaction patterns without duplication.
            </Text>
            <Text className='mt-4'>
              Application code in <code className='text-xs font-bold text-black bg-zinc-200 px-2.5 py-1.5 rounded-md inline'>apps/web</code> focuses solely on page composition and product flow,
              importing from the design system as needed.
            </Text>
          </div>
        </Container>
      </Section>
    </main>
  );
}
