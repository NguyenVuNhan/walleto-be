import helmet from "koa-helmet";
import Koa from "koa";
import { SwaggerRouter } from "koa-swagger-decorator";
import { config } from "./config";

const router = new SwaggerRouter();

// Swagger endpoint
router.swagger({
  title: config.name,
  description: config.description,
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(`${__dirname}`);

export const mountSwagger = (app: Koa) => {
  // Change header while using swagger-html
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "http://cdnjs.cloudflare.com"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "http://cdnjs.cloudflare.com",
          "http://fonts.googleapis.com",
        ],
        fontSrc: ["http://fonts.googleapis.com", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
      },
    })
  );

  app.use(router.routes());
};
