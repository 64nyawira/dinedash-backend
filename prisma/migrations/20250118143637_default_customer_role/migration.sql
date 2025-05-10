/*
  Warnings:

  - You are about to drop the column `date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expectations` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fieldOfInterest` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `other` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `suggestions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfStudy` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [date],
[dateOfBirth],
[expectations],
[fieldOfInterest],
[firstName],
[lastName],
[level],
[other],
[suggestions],
[yearOfStudy];
ALTER TABLE [dbo].[User] ADD [name] NVARCHAR(1000) NOT NULL,
[password] NVARCHAR(1000) NOT NULL,
[resetCode] NVARCHAR(1000),
[resetCodeExpiry] DATETIME2,
[role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'customer';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
