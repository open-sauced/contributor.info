import React from "react";
import { useRouter } from 'next/router'
import { useContributorData } from "../../../hooks/useContributorData";

const OwnerRepo = () => {
  const router = useRouter()
  const { owner, repo } = router.query

  const {isLoading, isError, data, meta} = useContributorData(owner as string, repo as string);

  return !isLoading && !isError ? (
    JSON.stringify(data))
   : "...working";
};

export default OwnerRepo;