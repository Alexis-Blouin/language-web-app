import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

function CategorySelect({
  categories,
  defaultCategory,
  setCategory,
  allCategories = true,
  newCategory = false,
  onChange = () => {},
}) {
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    onChange(); // Allows to have callback when the category changes
  };

  return (
    <Box sx={{ minWidth: 70 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          name="category"
          labelId="demo-simple-select-label"
          id=""
          value={defaultCategory}
          label="Category"
          onChange={handleCategoryChange}
        >
          {allCategories && <MenuItem value="all">All Categories</MenuItem>}
          {categories.map((category) => (
            <MenuItem key={category.CategoryId} value={category.CategoryId}>
              {category.CategoryName}
            </MenuItem>
          ))}
          {newCategory && (
            <MenuItem value="new-category">New Category</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CategorySelect;
