ALTER TABLE "Session"
  ADD COLUMN "reauthenticatedAt" TIMESTAMP(3);

-- Existing sessions predate explicit recent-reauthentication tracking and
-- therefore must reauthenticate before performing high-risk account changes.
