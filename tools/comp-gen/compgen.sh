
#!/bin/bash

# Set the root directory of the project
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Parse command-line arguments
while getopts ":p:n:" opt; do
  case $opt in
    p)
      dest_path="$OPTARG"
      ;;
    n)
      component_name="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Check if required arguments are provided
if [ -z "$dest_path" ] || [ -z "$component_name" ]; then
  echo "Usage: $0 -p <destination_path> -n <component_name>"
  exit 1
fi

# Generate kebab-case and PascalCase names
kebab_case_name=$(echo "$component_name" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')
pascal_case_name=$(echo "$component_name" | sed -e 's/\b\([a-z]\)/\u\1/g')

# Create directory
mkdir -p "$dest_path/$kebab_case_name"

# Copy template files
cp "$ROOT_DIR/templates/ConnectedComponent.tsx" "$dest_path/$kebab_case_name/Connected$pascal_case_name.tsx"
cp "$ROOT_DIR/templates/Component.tsx" "$dest_path/$kebab_case_name/$pascal_case_name.tsx"
cp "$ROOT_DIR/templates/Component.styles.ts" "$dest_path/$kebab_case_name/$pascal_case_name.styles.ts"
cp "$ROOT_DIR/templates/Component.types.ts" "$dest_path/$kebab_case_name/$pascal_case_name.types.ts"

# Replace placeholders in template files
sed -i '' "s/COMPONENT_NAME/$pascal_case_name/g" "$dest_path/$kebab_case_name/Connected$pascal_case_name.tsx"
sed -i '' "s/COMPONENT_NAME/$pascal_case_name/g" "$dest_path/$kebab_case_name/$pascal_case_name.tsx"
sed -i '' "s/COMPONENT_NAME/$pascal_case_name/g" "$dest_path/$kebab_case_name/$pascal_case_name.styles.ts"
sed -i '' "s/COMPONENT_NAME/$pascal_case_name/g" "$dest_path/$kebab_case_name/$pascal_case_name.types.ts"

echo "Component files generated successfully at: $dest_path/$kebab_case_name"