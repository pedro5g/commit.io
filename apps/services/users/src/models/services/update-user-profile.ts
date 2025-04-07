import { NotFoundException, prisma } from "@commit.oi/shared"
import { UpdateUserProfileDTO } from "../dtos/update-user-profile"

export const updateUserProfileService = async ({
  id,
  userName,
  bio,
}: UpdateUserProfileDTO) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    throw new NotFoundException("User not found")
  }

  const userUpdated = await prisma.user.update({
    where: { id },
    data: {
      userName,
      bio,
    },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true,
    },
  })

  return { userUpdated }
}
