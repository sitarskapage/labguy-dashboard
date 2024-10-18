import {
  GeneralSectionSchema,
  WorkSchema
} from '@jakubkanna/labguy-front-schema';

// Extend each schema by adding the 'general' property
type WorkSchemaWithGeneral = WorkSchema & {
  general: GeneralSectionSchema;
};

// DataType to include the new versions of each schema
type ProjectsOnWorks = {
  projectId: number;
  generalId: number;
  fIndex: string;
  work: WorkSchemaWithGeneral;
  [k: string]: unknown;
};

export type { ProjectsOnWorks };
