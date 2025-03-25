import { MetadataRepositoryRegistry } from '../application/metadata-repository-registry'
import { InMemoryFormRepository } from '../infra/in-memory-form-repository';
import { InMemoryMetadataRepository } from '../infra/in-memory-metadata-repository';
import { FakeUserProfileGateway } from '../fake-user-profile-gateway';
import { FormLayoutService } from './services/form-layout-service';
import { LoadFormAndMetadataListUseCase } from '../application/use-cases/load-form-and-metadata-list-use-case';
import { FormContext } from './contexts/form-context';
import { GetFormUseCase } from '../application/use-cases/get-form-use-case';
import { GetTemplateUseCase } from '../application/use-cases/get-template-use-case';
import { GetFormMetadataListUseCase } from '../application/use-cases/get-form-metadata-list-use-case';
import { FormSizeObserver } from './form-size-observer';
import { FormDragAndDropEventsAdapter } from './form-drag-and-drop-events-adapter';
import { MoveTemplateColumnUseCase } from '../application/use-cases/move-template-column-use-case';
import { MoveTemplateColumnToNewRowUseCase } from '../application/use-cases/move-template-column-to-new-row-use-case';
import { FormResizingEventsAdapter } from './form-resizing-events-adapter';
import { ResizeColumnUseCase } from '../application/use-cases/resize-column-use-case';
import { CheckIsValidResizePercentageColumnUseCase } from '../application/use-cases/check-is-valid-resize-percentage-column-use-case';
import { CreateDraftTemplateUseCase } from '../application/use-cases/create-draft-template-use-case';
import { RemoveTemplateUseCase } from '../application/use-cases/remove-template-use-case';
import { GetClosestTemplateUseCase } from '../application/use-cases/get-closest-template-use-case';
import { ChangeColumnTypeUseCase } from '../application/use-cases/change-column-type-use-case';

MetadataRepositoryRegistry.formRepository = new InMemoryFormRepository()
MetadataRepositoryRegistry.metadataRepository = new InMemoryMetadataRepository()

export const getFormUseCase = new GetFormUseCase()
export const getTemplateUseCase = new GetTemplateUseCase()
export const getFormMetadataListUseCase = new GetFormMetadataListUseCase()
export const moveTemplateColumnUseCase = new MoveTemplateColumnUseCase()
export const moveTemplateColumnToNewRowUseCase = new MoveTemplateColumnToNewRowUseCase()
export const resizeColumnUseCase = new ResizeColumnUseCase()
export const checkIsValidResizePercentageColumnUseCase = new CheckIsValidResizePercentageColumnUseCase()
export const loadFormAndMetadataListUseCase = new LoadFormAndMetadataListUseCase(new FakeUserProfileGateway())
export const createDraftTemplateUseCase = new CreateDraftTemplateUseCase()
export const removeTemplateUseCase = new RemoveTemplateUseCase()
export const getClosestTemplateUseCase = new GetClosestTemplateUseCase()
export const changeColumnTypeUseCase = new ChangeColumnTypeUseCase()

export const context = new FormContext(getFormUseCase, getTemplateUseCase, getFormMetadataListUseCase)
export const sizeObserver = new FormSizeObserver()
export const layoutService = new FormLayoutService(sizeObserver)
export const dragAndDropEventsAdapter = new FormDragAndDropEventsAdapter(context, moveTemplateColumnUseCase, moveTemplateColumnToNewRowUseCase)
export const resizingEventsAdapter = new FormResizingEventsAdapter(context, layoutService, resizeColumnUseCase, checkIsValidResizePercentageColumnUseCase)
