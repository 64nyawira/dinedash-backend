BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[LoyaltyPoints] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [points] INT NOT NULL CONSTRAINT [LoyaltyPoints_points_df] DEFAULT 0,
    CONSTRAINT [LoyaltyPoints_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LoyaltyPoints_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Reward] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [pointsCost] INT NOT NULL,
    CONSTRAINT [Reward_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Reward_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Redemption] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [rewardId] NVARCHAR(1000) NOT NULL,
    [redeemedAt] DATETIME2 NOT NULL CONSTRAINT [Redemption_redeemedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Redemption_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[LoyaltyPoints] ADD CONSTRAINT [LoyaltyPoints_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Redemption] ADD CONSTRAINT [Redemption_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Redemption] ADD CONSTRAINT [Redemption_rewardId_fkey] FOREIGN KEY ([rewardId]) REFERENCES [dbo].[Reward]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
