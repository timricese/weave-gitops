import * as React from "react";
import styled from "styled-components";
import { Kustomization } from "../lib/objects";
import { automationLastUpdated } from "../lib/utils";
import { useFeatureFlags } from "../hooks/featureflags";
import Alert from "./Alert";
import AutomationDetail from "./AutomationDetail";
import Interval from "./Interval";
import SourceLink from "./SourceLink";
import Timestamp from "./Timestamp";
import { InfoField } from "./InfoList";

export interface routeTab {
  name: string;
  path: string;
  visible?: boolean;
  component: (param?: any) => any;
}

type Props = {
  kustomization?: Kustomization;
  className?: string;
  customTabs?: Array<routeTab>;
  customActions?: JSX.Element[];
};

function KustomizationDetail({
  kustomization,
  className,
  customTabs,
  customActions,
}: Props) {
  const { data } = useFeatureFlags();
  const flags = data?.flags || {};

  const tenancyInfo: InfoField[] =
    flags.WEAVE_GITOPS_FEATURE_TENANCY === "true" && kustomization?.tenant
      ? [["Tenant", kustomization?.tenant]]
      : [];

  const clusterInfo: InfoField[] =
    flags.WEAVE_GITOPS_FEATURE_CLUSTER === "true"
      ? [["Cluster", kustomization?.clusterName]]
      : [];

  return (
    <AutomationDetail
      className={className}
      customTabs={customTabs}
      automation={kustomization}
      customActions={customActions}
      info={[
        [
          "Source",
          <SourceLink
            sourceRef={kustomization?.sourceRef}
            clusterName={kustomization?.clusterName}
          />,
        ],
        ["Applied Revision", kustomization?.lastAppliedRevision],
        ...clusterInfo,
        ...tenancyInfo,
        ["Path", kustomization?.path],
        ["Interval", <Interval interval={kustomization?.interval} />],
        [
          "Last Updated",
          <Timestamp time={automationLastUpdated(kustomization)} />,
        ],
        ["Namespace", kustomization?.namespace],
      ]}
    />
  );
}

export default styled(KustomizationDetail).attrs({
  className: KustomizationDetail.name,
})`
  width: 100%;

  ${Alert} {
    margin-bottom: 16px;
  }
`;
