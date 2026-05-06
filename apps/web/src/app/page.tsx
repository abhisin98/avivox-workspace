import { Badge } from "@avivox-workspace/ui/badge";
import { Button } from "@avivox-workspace/ui/button";
import { Card } from "@avivox-workspace/ui/card";
import { Container } from "@avivox-workspace/ui/container";
import { FeatureGrid } from "@avivox-workspace/ui/feature-grid";
import { Heading } from "@avivox-workspace/ui/heading";
import { Section } from "@avivox-workspace/ui/section";
import { Text } from "@avivox-workspace/ui/text";
import { Timeline } from "@avivox-workspace/ui/timeline";

import rootPackageJson from "../../../../package.json";
import { architectureCards, automationCards, branchRules, heroItems, trustItems, workflowSteps } from "../lib/content";

export default function Home() {
  return (
    <main className='bg-white'>
      {/* Hero Section */}
      <Section className='border-b border-zinc-200 bg-white'>
        <Container>
          <div className='py-16 sm:py-24 lg:py-32'>
            <div className='mx-auto max-w-4xl text-center'>
              <Badge className='justify-center'>v{rootPackageJson.version} • Production-Ready</Badge>
              <Heading className='mt-8'>Production-grade workspace architecture</Heading>
              <Text size='lg' className='mt-8 text-center'>
                A complete monorepo foundation with reusable components, shared configurations, and quality automation built for scalable teams.
              </Text>
              <div className='mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center'>
                <Button href='/architecture' variant='primary' size='lg'>
                  Explore Architecture
                </Button>
                <Button href='/workflow' variant='secondary' size='lg'>
                  View Workflow
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Features */}
      <Section className='bg-white border-b border-zinc-200'>
        <Container>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Built for quality and consistency</Heading>
            </div>
            <div className='grid gap-10 md:grid-cols-3'>
              {heroItems.map((item) => (
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

      {/* About Section */}
      <Section className='bg-zinc-50 border-b border-zinc-200'>
        <Container>
          <div className='grid gap-12 lg:gap-20 lg:grid-cols-[1fr_1fr] lg:items-start'>
            <div className='space-y-6'>
              <Heading level={2}>About Avivox Workspace</Heading>
              <Text>
                A professional monorepo structure that separates application code in <code className='text-xs font-bold text-black bg-zinc-200 px-2.5 py-1.5 rounded-md inline'>apps/web</code> from
                reusable UI components in <code className='text-xs font-bold text-black bg-zinc-200 px-2.5 py-1.5 rounded-md inline'>packages/ui</code>.
              </Text>
              <Text>Shared lint rules and TypeScript configurations keep the entire workspace consistent while allowing each app to evolve independently.</Text>
              <Button href='/architecture' variant='ghost'>
                Learn more →
              </Button>
            </div>
            <div className='grid gap-6'>
              {architectureCards.slice(0, 2).map((card) => (
                <Card key={card.title} title={card.title} description={card.description} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Automation Section */}
      <Section className='bg-white border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Automation and branch protection</Heading>
              <Text size='md' className='mt-4'>
                CI/CD pipelines and merge discipline ensure every change meets quality standards before reaching production.
              </Text>
            </div>
            <div className='grid gap-6 lg:grid-cols-3'>
              {automationCards.map((item) => (
                <Card key={item.title} variant='dark' title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Workflow Section */}
      <Section className='bg-zinc-50 border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Release workflow</Heading>
              <Text size='md' className='mt-4'>
                A structured pipeline from dev to production ensures stability and confidence.
              </Text>
            </div>
            <Timeline steps={workflowSteps} />
          </div>
        </Container>
      </Section>

      {/* Branch Rules */}
      <Section className='bg-white border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Branch protection strategy</Heading>
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {branchRules.map((rule) => (
                <Card key={rule.name} title={rule.name} description={rule.policy} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Core Pillars */}
      <Section className='bg-zinc-50 border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Core pillars of the workspace</Heading>
            </div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {trustItems.map((item) => (
                <Card key={item.label} title={item.label} description={item.value} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Design System */}
      <Section className='bg-white'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Design system principles</Heading>
              <Text size='md' className='mt-4'>
                The UI component library is built with consistency, reusability, and clarity in mind.
              </Text>
            </div>
            <FeatureGrid
              items={[
                { title: "Tailor-made spacing", description: "A carefully tuned spacing scale ensures visual harmony across all layouts and components." },
                { title: "Typography hierarchy", description: "Clear heading and text styles communicate information structure and visual emphasis." },
                { title: "Subtle refinement", description: "Premium touches include clean borders, soft shadows, and intentional hover states." },
              ]}
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
