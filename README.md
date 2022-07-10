# cidr2range

This module provides utilities for converting CIDR to range of IP address, and
vice versa.

## Use as command line interface

```bash
# Convert CIDR to range of IP address
deno run -A https://deno.land/x/cidr2range/cli.ts cidr2range --cidr 10.1.2.3/25
# Output:
#   10.1.2.0
#   10.1.2.127

# Convert range IP address to CIDR
deno run -A https://deno.land/x/cidr2range/cli.ts range2cidr --range 10.1.2.3,10.1.2.123
# Output:
#   10.1.2.3/32
#   10.1.2.4/30
#   10.1.2.8/29
#   10.1.2.16/28
#   10.1.2.32/27
#   10.1.2.64/27
#   10.1.2.96/28
#   10.1.2.112/29
#   10.1.2.120/30
```
