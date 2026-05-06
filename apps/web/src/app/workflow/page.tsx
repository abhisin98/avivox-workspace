import { Badge } from "@avivox-workspace/ui/badge";
import { Card } from "@avivox-workspace/ui/card";
import { Container } from "@avivox-workspace/ui/container";
import { Heading } from "@avivox-workspace/ui/heading";
import { Section } from "@avivox-workspace/ui/section";
import { Text } from "@avivox-workspace/ui/text";
import { Timeline } from "@avivox-workspace/ui/timeline";

import { automationCards, branchRules, workflowSteps } from "../../lib/content";

export default function WorkflowPage() {
  return (
    <main className='bg-white'>
      {/* Hero */}
      <Section className='border-b border-zinc-200 bg-white'>
        <Container>
          <div className='py-16 sm:py-24 lg:py-32'>
            <div className='mx-auto max-w-3xl text-center'>
              <Badge className='justify-center' variant='light'>
                Workflow
              </Badge>
              <Heading className='mt-8'>Release workflow for production</Heading>
              <Text size='lg' className='mt-8 text-center'>
                A structured pipeline from development through QA, beta, and production ensures every change meets quality standards before deployment.
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pipeline Stages */}
      <Section className='border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Pipeline stages</Heading>
              <Text size='md' className='mt-4'>
                Each stage has clear responsibilities and quality gates.
              </Text>
            </div>
            <Timeline steps={workflowSteps} />
          </div>
        </Container>
      </Section>

      {/* Automation & Quality */}
      <Section className='bg-zinc-50 border-b border-zinc-200'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Automation and quality gates</Heading>
            </div>
            <div className='grid gap-6 lg:grid-cols-3'>
              {automationCards.map((item) => (
                <Card key={item.title} variant='dark' title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Branch Strategy */}
      <Section className='bg-white'>
        <Container>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-16'>
              <Heading level={2}>Branch protection strategy</Heading>
              <Text size='md' className='mt-4'>
                Each branch has specific protections and merge requirements.
              </Text>
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {branchRules.map((rule) => (
                <Card key={rule.name} title={rule.name} description={rule.policy} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
