import dotenv from 'dotenv'

export default async function globalSetup() {
  dotenv.config({
    path: '.env.local',
    override: true,
  })
}
