import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useContributorData } from "../../../hooks/useContributorData";

type Response =
  | { type: "loading" }
  | { type: "error"; error: Error }
  // Todo: figure out meta
  | { type: "result"; data: DBContributors[]; meta: { itemCount: number } };

const Child = (props: { owner: string; repo: string }) => {
  const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(
    `repos/${owner}/${repo}/contributions`
  );

  return (
    <>
      Got your data....
      <pre>
        <code>{JSON.stringify({ data, error })}</code>
      </pre>
    </>
  );
};

// Is this a React component? Maybe the file should be .tsx? +1
const OwnerRepo = () => {
  const router = useRouter();
  const [dbRepo, setDbRepo] = useState();

  // Keep track of our assumptions about data types coming from `router`
  const owner = router.query["owner"] as string;
  const repo = router.query["repo"] as string;
  console.log(router.query);

  // Temp test/hack
  useEffect(
    (owner: string, repo: string): Response => {
      console.log(owner);
      // +1
      // useSWR can't be called conditionally, but we also don't want to call it without owner/repo
      // we can _wrap_ the component and only render it when the parent component has owner/repo
      // Ok, let me try that, one minute....

      if (owner && repo) {
        const { data, error, mutate } = useSWR<PaginatedDataResponse, Error>(
          `repos/${owner}/${repo}/contributions`
        );

        if (!error && !data) {
          return { type: "loading" };
        }

        if (error) {
          return {
            type: "error",
            error: error,
          };
        }
      }

      return {
        type: "result",
        data: data?.data ?? [],
        meta: data?.meta ?? { itemCount: 0 },
        mutate,
      };
    },
    [owner, repo]
  );

  // Why don't we just use `useContributorData` directly? -> [x]
  // done :>
  useEffect(() => {
    const result = useContributorData(owner, repo);
  }, [owner, repo]);

  if (owner && repo) {
    return <ChildWithSWR owner={owner} repo={repo} />;
  }

  console.warn("No owner or repo:", owner, repo);

  return "Loading...";

  // const pending = useContributorData(owner, repo);

  // if (pending.type === "loading") {
  //   return "....working"
  // }

  // if (pending.type === "error") {
  //   return `Hit an error: ${pending.error}`
  // }

  // // Because of the tag-based `type` field, TypeScript _knows_ that
  // // there's `pending.data` now, and we can just return it
  // return JSON.stringify(pending.data);
};

export default OwnerRepo;
