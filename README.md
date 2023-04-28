# Update iOS Plist

This action updates or adds custom key/value pairs in the Info.plist file for your iOS projects.

## Inputs

### `info-plist-path`

**Required** The relative path for the Info.plist file.

### `key-value-json`

**Required** A JSON string containing an array of key/value pairs.

###  `print-file`

Output the Info.plist file in console before and after update.

## Usage

```yaml
- name: Update iOS Plist
  uses: dppeak/update-ios-plist-action@v1.1.0
  with:
    info-plist-path: './path_to_your/Info.plist'
    key-value-json: '[{"FirstCustomKey": "Some new Value"}, {"SecondCustomKey": "Another Value"}]'
    print-file: true
```
