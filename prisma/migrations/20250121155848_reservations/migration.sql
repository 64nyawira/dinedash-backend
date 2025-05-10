BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Table] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [capacity] INT NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Table_status_df] DEFAULT 'available',
    CONSTRAINT [Table_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Table_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Reservation] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [tableId] NVARCHAR(1000) NOT NULL,
    [reservationTime] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Reservation_status_df] DEFAULT 'active',
    CONSTRAINT [Reservation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_tableId_fkey] FOREIGN KEY ([tableId]) REFERENCES [dbo].[Table]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
