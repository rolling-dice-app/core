---
'@rolling-dice-app/core': minor
---

Add m7.2 DM session contract: `DmSessionContainerDTO` (owner-scoped container grouping session logs by scenario / player group, with shared member shapes `DmSessionMemberDTO` / `DmSessionMemberInput`) and `DmSessionLogDTO` as its sub-resource (`containerId`-linked), each with summary / create / update shapes, `buildDmSessionContainerCreateDefaults` / `buildDmSessionLogCreateDefaults`, plus `PlanLimits.maxDmSessionContainers` / `maxDmSessionLogsPerContainer` and validation limits `maxMembersPerDmSessionContainer` / `maxMembersPerDmSessionLog` / `maxItemRewardsPerDmSessionLog`.
