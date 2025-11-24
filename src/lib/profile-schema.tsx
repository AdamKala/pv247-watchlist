import { z } from 'zod';

const schema = z.object({
	name: z.string().min(2).max(50),
	image: z.string().nullable().optional(),
	description: z.string().max(200).optional()
});

type ProfileSchema = z.infer<typeof schema>;

export { schema, type ProfileSchema };
