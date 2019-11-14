// import * as _Viewer from 'bpmn-js/dist/bpmn-viewer.production.min.js';
// import _PropertiesPanelModule from 'bpmn-js-properties-panel';
// import _BpmnPropertiesProvider from 'bpmn-js-properties-panel/lib/provider/bpmn';
// import _EntryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
// import _PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

declare var _Viewer;
declare var _PropertiesPanelModule;
declare var _BpmnPropertiesProvider;
declare var _EntryFactory;
declare var _PaletteProvider;


export const InjectionNames = {
    eventBus: 'eventBus',
    bpmnFactory: 'bpmnFactory',
    elementRegistry: 'elementRegistry',
    translate: 'translate',
    propertiesProvider: 'propertiesProvider',
    bpmnPropertiesProvider: 'bpmnPropertiesProvider',
    paletteProvider: 'paletteProvider',
    originalPaletteProvider: 'originalPaletteProvider',
};

export const Viewer = _Viewer;
export const PropertiesPanelModule = _PropertiesPanelModule;
export const EntryFactory = _EntryFactory;
export const OriginalPaletteProvider = _PaletteProvider;
export const OriginalPropertiesProvider = _BpmnPropertiesProvider;

export interface IPaletteProvider {
    getPaletteEntries(): any;
}

export interface IPalette {
    registerProvider(provider: IPaletteProvider): any;
}

export interface IPropertiesProvider {
    getTabs(elemnt): any;
}
