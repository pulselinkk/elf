# Workpedia Schema

Use these field patterns when adding data.

## Service Object

```json
{
  "id": "painting",
  "name": "Painting",
  "category": "surface_finish",
  "homeowner_intent": ["refresh", "resale", "protection"],
  "quote_inputs": ["photos", "square_footage", "surface_condition"],
  "risk_factors": ["UV exposure", "bad prep", "moisture", "wrong sheen"],
  "deliverables": ["prep", "prime", "paint", "cleanup", "walkthrough"],
  "interactive_tools": ["budget range", "prep checklist", "finish selector"]
}
```

## Location Object

```json
{
  "city": "Frisco",
  "region": "North DFW",
  "housing_patterns": ["2000s builder-grade", "master-planned communities"],
  "common_projects": ["kitchens", "LVP", "cabinet refinishing"],
  "local_notes": ["HOA visibility", "open floor plans", "resale-driven upgrades"],
  "message_prompt": "Send neighborhood, photos, dimensions, HOA constraints, and timeline."
}
```

## Guide Object

```json
{
  "slug": "kitchen-remodel-cost-dfw",
  "type": "cost_guide",
  "primary_decision": "How much should I budget?",
  "sections": ["price range", "cost drivers", "what to avoid", "quote checklist"],
  "data_dependencies": ["service_cost_ranges", "materials", "timeline"],
  "conversion_path": "quote.html"
}
```

## Atomic Fact Object

```json
{
  "id": "paint.prep.001",
  "topic": "painting",
  "claim": "Exterior paint lifespan depends more on prep and UV exposure than brand alone.",
  "use_in": ["painting pages", "exterior paint guides", "FAQs"],
  "risk": "medium",
  "verify_before_publication": false
}
```

