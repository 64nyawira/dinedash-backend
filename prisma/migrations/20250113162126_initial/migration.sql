BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [other] NVARCHAR(1000),
    [email] NVARCHAR(1000) NOT NULL,
    [yearOfStudy] NVARCHAR(1000) NOT NULL,
    [dateOfBirth] DATETIME2 NOT NULL,
    [date] DATETIME2 NOT NULL,
    [fieldOfInterest] NVARCHAR(1000) NOT NULL,
    [level] NVARCHAR(1000) NOT NULL,
    [expectations] NVARCHAR(1000) NOT NULL,
    [suggestions] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] NVARCHAR(1000) NOT NULL,
    [dishName] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [ingredients] NVARCHAR(1000) NOT NULL,
    [allergenInfo] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000),
    [servingTimes] NVARCHAR(1000),
    [addOns] NVARCHAR(1000),
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
