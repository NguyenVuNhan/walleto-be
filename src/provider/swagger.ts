import helmet from "koa-helmet";
import Koa from "koa";
import { SwaggerRouter } from "koa-swagger-decorator";
import { config } from "./config";

const router = new SwaggerRouter();

// Swagger endpoint
router.swagger({
  title: config.name,
  description: config.description,
  version: "1.0.0",
  swaggerOptions: {
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        name: "Authorization",
        scheme: "bearer",
        in: "header",
      },
      ApiKeyAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
  swaggerConfiguration: {
    display: {
      defaultModelsExpandDepth: 4, // The default expansion depth for models (set to -1 completely hide the models).
      defaultModelExpandDepth: 3, // The default expansion depth for the model on the model-example section.
      docExpansion: "list", // Controls the default expansion setting for the operations and tags.
      defaultModelRendering: "model", // Controls how the model is shown when the API is first rendered.
    },
  },
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(`${__dirname}/..`, {
  ignore: ["@types/**/*"],
});

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
