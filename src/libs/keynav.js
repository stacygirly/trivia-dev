import * as d3 from "d3";
import { compile } from "vega-lite";
import { View, parse } from "vega";
import { DataSourceType } from "vega-lite/build/src/data";

export const getFieldName = (spec, scaleName) => {
    const isDataRef = (d) => typeof d === "object" && !Array.isArray(d) && d !== null;
    const scale = spec.scales.find(d => d.name === scaleName);
    if (isDataRef(scale.domain)) {
        if (scale.domain.field) { // string field name // TODO: what if it's a data ref?
            return scale.domain.field;
        }
        // multi-field data ref
        // TODO: support two different fields https://vega.github.io/vega/docs/scales/#dataref
        if (scale.domain.fields) { //scale.domain.fields[0].split("_")[0]            
            if (isDataRef(scale.domain.fields[0])) {
                return scale.domain.fields[0].field;
            } else {
                const split = scale.domain.fields[0].split("_");
                const isDerived = split.length > 1;
                return isDerived ? split[0] : scale.domain.fields[0]

            }
        }
    }
    switch (scaleName) {
        case "x":
        case "y":
            return spec.marks[0].encode.update[scaleName].field;
        case "color":
            return spec.marks[0].encode.update["fill"].field;
    }

}
export const getEncodingTitle = (spec, scaleName) => {
    switch (scaleName) {
        case "x":
        case "y":
            return spec.axes.find(d => d.scale === scaleName && d.title).title;
        case "color":
            return spec.legends.find(d => Object.keys(d).some(p => d[p] === scaleName)).title;
    }
}
export const getEncodingType = (spec, scaleName) => {
    // does it have a legend?
    const hasLegend = spec.legends.some(d => Object.keys(d).some(p => d[p] === scaleName));
    switch (scaleName) {
        case "x":
            return 'horizontal axis';//`${scaleName} axis`;
        case "y":
            return 'vertical axis';//`${scaleName} axis`;
        case "color":
            return `${scaleName} ${hasLegend ? 'legend' : 'encoding'}`
    }
}
export const prev = (node) => {
    if (!node.parent) return node;
    const index = node.parent.children.indexOf(node);
    if (index > 0) {
        return node.parent.children[index - 1];
    }
    return node;
}


export const next = (node) => {
    if (!node.parent) return node;
    const index = node.parent.children.indexOf(node);
    if (index < node.parent.children.length - 1) {
        return node.parent.children[index + 1];
    }
    return node;
}

export const up = (node) => {
    if (node.parent) {
        return node.parent;
    }
    return node;
}

export const down = (node) => {
    if (node.children.length) {
        if (node.lastVisitedChild) return node.lastVisitedChild;
        return node.children[0];
    }
    return node;
}




export const navtree = async (spec, options = {}) => {
    const defaultOptions = { skip: [], customGroups: [], datumDesc:null, formatters:{} };

    options = { ...defaultOptions, ...options };
    const { skip, customGroups } = options;

    console.log("=== generate navigation tree (start)===");
    const scales = spec.scales;
    console.log("spec", spec)
    // console.log("data", spec.data);
    console.log("scales", scales);

    const view = new View(parse(spec));
    await view.runAsync(); // draw the chart virtually 

    const datasource = view.data("source_0");
    console.log("datasource", datasource);

    // console.log("datumDesc", options);
    const rootNode = {
        parent: null,
        children: [],
        lastVisitedChild: null,
        description: spec.description
    };

    const {formatters} = options;
    const datumDesc = options.datumDesc? options.datumDesc: (datum, index, field, group, spec) => {
        const otherFields = spec.scales.map(d => getFieldName(spec, d.name)).filter(d => d != field);
        // console.log(field,otherFields, formatters);
        return `${index + 1} of ${group.length} items. ${field}: ${formatters[field]?formatters[field](datum[field]):datum[field]}, ${otherFields.map(otherField => `${otherField}: ${formatters[otherField]?formatters[otherField](datum[otherField]):datum[otherField]}`).join(", ")}`
    }

    const categorySubgroupDesc = (group, field, value, index, parentGroup, spec) => {
        return `${index + 1} of ${parentGroup.length} categories, ${field}: ${value}, ${group.length} values`
    }

    const categoryGroupDesc = (type, title, domain, field, spec) => {
        return `${type} titled ${title} with categories starting from ${domain[0]} to ${domain[domain.length - 1]}`
    }

    const numericSubgroupDesc = (group, field, extent, index, parentGroup, spec) => {
        return `${index + 1} of ${parentGroup.length} ${field} ranges, from ${formatters[field]?formatters[field](extent[0]):extent[0]} to ${formatters[field]?formatters[field](extent[1]):extent[1]}, ${group.length} values`
    }

    const numericGroupDesc = (type, title, domain, field, spec) => {
        return `${type} titled ${title} with categories starting from ${formatters[field]?formatters[field](domain[0]):domain[0]} to ${formatters[field]?formatters[field](domain[domain.length - 1]):domain[domain.length - 1]}`
    }
    const createDatumNode = (datum, index, focusField, parent, spec) => {
        return {
            parent,
            type: "datum",
            selection: [datum],
            lastVisitedChild: null,
            children: [],
            description: datumDesc(datum, index, focusField, parent.selection, spec)
        }
    }
    const createCategorySubgroupNode = (group, field, value, index, parent, spec) => {
        // console.log("spec",spec);

        // level - 2
        const node = {
            parent: parent,
            type: "category-subgroup",
            selection: group,
            lastVisitedChild: null,
            description: categorySubgroupDesc(group, field, value, index, parent.selection, spec)
        }
        // level - 3
        node.children = group.map((d, i) => createDatumNode(d, i, field, node, spec));

        return node;
    }

    const createCategoryEncodingNode = (domain, type, title, field, parent, datasource, spec) => {
        const groups = d3.group(datasource, d => d[field]);
        // console.log('groups', d3.groups(datasource, d => d[field]),field);
        // level - 1
        const encodingNode = {
            parent,
            lastVisitedChild: null
        };
        encodingNode.type = "category-group";
        encodingNode.description = categoryGroupDesc(type, title, domain, field, spec);

        // if all subgroups have a single item, there is no reason to go a level deeper
        const expand = Array.from(groups.values()).some(d => d.length !== 1);

        if (expand) {
            encodingNode.selection = domain;
            // console.log("domain", domain,field);
            encodingNode.children = domain.map((group, index) => {
                // console.log("Group",group, index)
                const selection = groups.get(group);//datasource.filter(d => d[field] === group);
                const categorySubgroupNode = createCategorySubgroupNode(selection, field, group, index, encodingNode, spec);
                return categorySubgroupNode;
            });
        } else {
            const values = Array.from(groups.values()).flat();
            encodingNode.selection = values;
            encodingNode.children = values.map((datum, index) => createDatumNode(datum, index, field, encodingNode, spec));
        }
        return encodingNode;
    }

    const createNumericSubgroupNode = (group, field, extent, index, parent, spec) => {
        // level - 2
        const node = {
            parent,
            type: "numeric-subgroup",
            selection: group,
            lastVisitedChild: null,
            description: numericSubgroupDesc(group, field, extent, index, parent.selection, spec)
        }
        // level - 3
        node.children = group.map((d, i) => createDatumNode(d, i, field, node, spec));
        return node;
    }


    const createNumericEncodingNode = (groupSize, domain, type, title, field, parent, datasource, spec) => {
        const encodingNode = {
            parent,
            lastVisitedChild: null
        };
        encodingNode.type = "category-group";
        encodingNode.description = numericGroupDesc(type, title, domain, field, spec);

        const quantized = d3.scaleQuantize()
            .domain(domain)// divide the domain into 
            .range(d3.range(groupSize)) // five ranges

        encodingNode.selection = d3.range(groupSize); // this is only to provide the size of the group for the desc func
        encodingNode.children = d3.range(groupSize).map((group, groupIdx) => {
            const extent = quantized.invertExtent(group);
            const selection = datasource.filter(d => quantized(d[field]) === group);

            return createNumericSubgroupNode(selection, field, extent, groupIdx, encodingNode, spec);
        });
        return encodingNode;
    }


    rootNode.children = scales.filter(d => !skip || !skip.includes(d.name)).map(d => {
        let scale, field, type, title, domain;

        switch (d.type) {
            // numeric scales (TODO: log?)
            case "linear":
                scale = view.scale(d.name);
                domain = scale.domain();
                // level - 1
                const groupSize = 5;
                type = getEncodingType(spec, d.name);
                title = getEncodingTitle(spec, d.name);
                field = getFieldName(spec, d.name);// find the data field name

                return createNumericEncodingNode(groupSize, domain, type, title, field, rootNode, datasource, spec);

            // categorical scales
            case "point":
            case "ordinal":
            case "band":
                scale = view.scale(d.name);
                domain = scale.domain(); // TODO: can the domain different from the list of unique values in the field?
                type = getEncodingType(spec, d.name);
                title = getEncodingTitle(spec, d.name);
                field = getFieldName(spec, d.name);// find the data field name
                return createCategoryEncodingNode(domain, type, title, field, rootNode, datasource, spec);


        }
    });

    // to handle data groups that are not explicitly captured by the encoding spec (e.g., geoshape in a map)
    customGroups.map(({ type, title, field }) => {

        const isCategorical = datasource.every(d => isNaN(d[field]));
        if (isCategorical) {
            const groups = d3.group(datasource, d => d[field]);
            const domain = Array.from(groups.keys()); // unique categories
            rootNode.children.push(createCategoryEncodingNode(domain, type, title, field, rootNode, datasource, spec));
        }//TODO: else handle numeric


    })
    console.log("=== generate navigation tree (end)===");
    return rootNode;
}
