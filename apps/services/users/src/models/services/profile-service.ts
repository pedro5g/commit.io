import { NotFoundException, prisma } from "@commit.oi/shared"
import { ProfileDTO } from "../dtos/profile-dto"

export const profileService = async ({
  userId,
  accountProvider,
}: ProfileDTO) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      bio: true,
      isEmailVerified: true,
      accounts: {
        where: {
          provider: accountProvider,
        },
        select: {
          id: true,
          provider: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!user) {
    throw new NotFoundException("User not found")
  }

  return {
    userAccount: {
      user: {
        id: user.id,
        userName: user.userName,
        bio: user.bio,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      account: {
        id: user.accounts[0].id,
        provider: user.accounts[0].provider,
        avatarUrl: user.accounts[0].avatarUrl,
      },
    },
  }
}
