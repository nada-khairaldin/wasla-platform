import { useInfiniteQuery } from "@tanstack/react-query";
import { skillsService } from "../services/skillsService";
import { Skill } from "../types";

interface SkillsPage {
  skills: Skill[];
}

export const useInfiniteSkills = (batchSize = 10) => {
  return useInfiniteQuery({
    queryKey: ["skills", "infinite", batchSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const offset = pageParam * batchSize;
      const { data, error } = await skillsService.getSkills({
        limit: batchSize,
        offset,
      });

      if (error) {
        throw new Error(error);
      }

      return {
        skills: data?.skills ?? [],
      } satisfies SkillsPage;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.skills.length < batchSize) {
        return undefined;
      }

      const previousIds = new Set<number>();
      pages.slice(0, -1).forEach((page) => {
        page.skills.forEach((skill) => previousIds.add(skill.id));
      });

      const currentIds = new Set<number>(previousIds);
      lastPage.skills.forEach((skill) => currentIds.add(skill.id));

      // Stop if backend returns the same set repeatedly.
      if (currentIds.size === previousIds.size) {
        return undefined;
      }

      return pages.length;
    },
    staleTime: 1000 * 60 * 10,
  });
};
