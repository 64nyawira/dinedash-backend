BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Inventory] (
    [id] NVARCHAR(1000) NOT NULL,
    [menuId] NVARCHAR(1000) NOT NULL,
    [stock] INT NOT NULL,
    [threshold] INT NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Inventory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Inventory_menuId_key] UNIQUE NONCLUSTERED ([menuId])
);

-- CreateTable
CREATE TABLE [dbo].[Analytics] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000),
    [orderId] NVARCHAR(1000),
    [action] NVARCHAR(1000) NOT NULL,
    [details] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Analytics_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Analytics_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_menuId_fkey] FOREIGN KEY ([menuId]) REFERENCES [dbo].[Menu]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Analytics] ADD CONSTRAINT [Analytics_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Analytics] ADD CONSTRAINT [Analytics_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[Order]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
