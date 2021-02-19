import { config } from "../../provider/config";

type State = typeof config;

declare module "koa" {
  interface DefaultState extends State {}
}
