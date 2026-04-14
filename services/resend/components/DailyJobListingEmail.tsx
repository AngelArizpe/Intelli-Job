import { JobListingTable } from "@/drizzle/schema";
import {
    Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig from "../data/tailwindConfig";
import {
  formateWage,
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
} from "@/features/jobListings/lib/formatters";

type JobListing = Pick<
  typeof JobListingTable.$inferSelect,
  | "id"
  | "title"
  | "city"
  | "stateAbbreviation"
  | "type"
  | "experienceLevel"
  | "wage"
  | "wageInterval"
  | "locationRequirement"
> & {
  organizationName: string;
};

export default function DailyJobListingEmail({
  userName,
  jobListings,
  serverUrl,
}: {
  userName: string;
  jobListings: JobListing[];
  serverUrl: string;
}) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans">
          <Heading as="h1">New job listings!</Heading>
          <Text>
            Hi, {userName}. Here's a list of the job listings that meet your
            criteria.
          </Text>
          <Section>
            {jobListings.map((jobListing) => (
              <div
                key={jobListing.id}
                className="bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid mb-6"
              >
                <Text className="leading-none font-semibold text-xl my-0">
                  {jobListing.title}
                </Text>
                <Text className="text-muted-foreground mb-2 mt-0">
                  {jobListing.organizationName}
                </Text>
                <div className="mb-5">
                  {getBadges(jobListing).map((badge, index) => (
                    <div
                      key={index}
                      className="inline-block rounded-md border-solid border font-medium w-fit text-foreground text-sm px-3 py-1 mb-1 mr-1"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
                <Button
                    href={`${serverUrl}/job-listings/${jobListing.id}`}
                    className="rounded-md text-sm font-medium focus-visible: border-ring bg-primary text-primary-foreground px-4 py-2"
                >
                    View details
                </Button>
              </div>
            ))}
          </Section>
        </Container>
      </Html>
    </Tailwind>
  );
}

function getBadges(jobListing: JobListing) {
  const badges = [
    formatLocationRequirement(jobListing.locationRequirement),
    formatJobType(jobListing.type),
    formatExperienceLevel(jobListing.experienceLevel),
  ];

  if (jobListing.city != null || jobListing.stateAbbreviation != null) {
    badges.unshift(formatJobListingLocation(jobListing));
  }

  if (jobListing.wage != null && jobListing.wageInterval != null) {
    badges.unshift(formateWage(jobListing.wage, jobListing.wageInterval));
  }

  return badges;
}