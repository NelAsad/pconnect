// -----------------------------------------------------------------------------
// Filtre global de gestion des exceptions
// Intercepte toutes les exceptions non gérées et retourne une réponse structurée
// Loggue les erreurs critiques pour le monitoring
// -----------------------------------------------------------------------------
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Intercepte et gère toutes les exceptions non catchées par NestJS
   * @param exception Exception levée
   * @param host Contexte d'exécution
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : exception;

    // Loggue les erreurs critiques (500 ou non HttpException)
    if (status === 500 || !(exception instanceof HttpException)) {
      this.logger.error(`Critical error: ${JSON.stringify(message)}`, (exception as any)?.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
