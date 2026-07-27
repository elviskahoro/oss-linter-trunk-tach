from module_b import helper

# Boundary violation: module_a has no declared dependency on module_b.
result = helper()
