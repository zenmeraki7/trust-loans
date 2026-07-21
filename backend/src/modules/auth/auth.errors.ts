import { AppError } from "../../utils/AppError.js";

export class InvalidCredentialsError extends AppError {
  readonly challengeRequired: boolean;

  constructor(challengeRequired = false) {
    super("Invalid email or password.", 401);
    this.challengeRequired = challengeRequired;
  }
}
