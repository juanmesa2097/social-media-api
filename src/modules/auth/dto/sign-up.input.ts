import { InputType, IntersectionType, PickType } from '@nestjs/graphql';
import { ProfileCreateInput } from 'src/@generated/profile/profile-create.input';
import { UserCreateInput } from 'src/@generated/user/user-create.input';

@InputType()
export class SignUpInput extends IntersectionType(
  PickType(UserCreateInput, ['email', 'password'] as const),
  PickType(ProfileCreateInput, ['firstName', 'lastName'] as const),
) {}
