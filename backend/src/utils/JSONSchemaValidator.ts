import fs from 'fs';
import Ajv, { ValidateFunction } from 'ajv';

class JSONSchemaValidator {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv({ strict: false }); // Disable strict mode
    }

    /**
     * Validate an object against a JSON Schema.
     * @param object - The object to validate.
     * @param schemaPath - The file path to the JSON Schema.
     * @returns {boolean} - Returns true if valid, false if invalid or schema file does not exist.
     */
    validateObject(object: any, schemaPath: string): boolean {
        // Check if schema file exists
        if (!fs.existsSync(schemaPath)) {
            console.error(`Schema file does not exist: ${schemaPath}`);
            return false;
        }

        try {
            // Read and parse the JSON Schema
            const schemaContent = fs.readFileSync(schemaPath, 'utf8');
            const schema = JSON.parse(schemaContent);

            // Compile the schema
            const validate: ValidateFunction = this.ajv.compile(schema);

            // Validate the object
            const isValid = validate(object);

            if (isValid) {
                return true; // Object is valid
            }

            // Print validation errors
            console.error('Validation failed with the following errors:');
            validate.errors?.forEach((error) => {
                console.error(
                    `  - ${error.instancePath || '/'} ${error.message} (schema path: ${error.schemaPath})`
                );
                console.error(error);
            });

            return false; // Object is invalid
        } catch (error: any) {
            console.error(`Error during validation: ${error.message}`);
            return false;
        }
    }
}

export default JSONSchemaValidator;
