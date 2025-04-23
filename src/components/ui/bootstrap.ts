import { InMemoryFormRepository } from "../infra/in-memory-form-repository";
import { InMemoryMetadataRepository } from "../infra/in-memory-metadata-repository";
import { FakeUserProfileGateway } from "../fake-user-profile-gateway";
import { FormLayoutService } from "./services/form-layout-service";
import { FormContext } from "./contexts/form-context";
import { GetFormUseCase } from "../application/use-cases/get-form-use-case";
import { GetTemplateUseCase } from "../application/use-cases/get-template-use-case";
import { FormSizeObserver } from "./form-size-observer";
import { FormDragAndDropEventsAdapter } from "./form-drag-and-drop-events-adapter";
import { MoveColumnUseCase } from "../application/use-cases/move-column-use-case";
import { MoveColumnToNewRowUseCase } from "../application/use-cases/move-column-to-new-row-use-case";
import { FormResizingEventsAdapter } from "./form-resizing-events-adapter";
import { ResizeColumnUseCase } from "../application/use-cases/resize-column-use-case";
import { CheckIsValidResizePercentageColumnUseCase } from "../application/use-cases/check-is-valid-resize-percentage-column-use-case";
import { SyncFormUseCase } from "../application/use-cases/sync-form-use-case";
import { Container } from "../base/di";

Container.register(new InMemoryFormRepository());
Container.register(new InMemoryMetadataRepository());
Container.register(new FakeUserProfileGateway());

export const getFormUseCase = Container.register(new GetFormUseCase());
export const getTemplateUseCase = Container.register(new GetTemplateUseCase());
export const moveColumnUseCase = Container.register(new MoveColumnUseCase());
export const moveColumnToNewRowUseCase = Container.register(new MoveColumnToNewRowUseCase());
export const resizeColumnUseCase = Container.register(new ResizeColumnUseCase());
export const checkIsValidResizePercentageColumnUseCase = Container.register(new CheckIsValidResizePercentageColumnUseCase());
export const syncFormUseCase = Container.register(new SyncFormUseCase());

export const context = new FormContext();
export const sizeObserver = new FormSizeObserver();
export const layoutService = Container.resolve(FormLayoutService).using(sizeObserver);
export const dragAndDropEventsAdapter = Container.resolve(FormDragAndDropEventsAdapter).using(context);
export const resizingEventsAdapter = Container.resolve(FormResizingEventsAdapter).using(context, layoutService);
