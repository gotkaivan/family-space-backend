import { HttpException, HttpStatus } from '@nestjs/common'

export function getBadRequest(message: string) {
  throw new HttpException(message, HttpStatus.BAD_REQUEST)
}
