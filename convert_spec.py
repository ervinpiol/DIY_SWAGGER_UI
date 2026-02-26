import json
import os

def convert_postman_to_spec(postman_json):
    spec = []
    
    for top_level_item in postman_json['item']:
        section = {
            "title": top_level_item['name'],
            "description": top_level_item.get('description', '').replace('\n', '\\n'),
            "endpoints": []
        }
        
        def process_items(items, tags=[]):
            endpoints = []
            for item in items:
                if 'item' in item:
                    new_tags = tags + [item['name']]
                    endpoints.extend(process_items(item['item'], new_tags))
                else:
                    request = item.get('request', {})
                    method = request.get('method', 'GET')
                    url = request.get('url', {})
                    
                    path_parts = url.get('path', [])
                    path = "/" + "/".join([f":{p['key']}" if isinstance(p, dict) and p.get('key') else str(p) for p in path_parts])
                    if path.startswith("//"): path = path[1:]
                    
                    summary = item['name']
                    description = request.get('description', '').replace('\n', '\\n')
                    
                    endpoint = {
                        "method": method,
                        "path": path,
                        "summary": summary,
                        "description": description,
                        "tags": tags.copy()
                    }
                    
                    query_params = url.get('query', [])
                    parameters = []
                    for qp in query_params:
                        parameters.append({
                            "name": qp['key'],
                            "in": "query",
                            "required": False,
                            "type": "string",
                            "description": qp.get('description', '').replace('\n', '\\n')
                        })
                    
                    path_vars = url.get('variable', [])
                    for pv in path_vars:
                        parameters.append({
                            "name": pv['key'],
                            "in": "path",
                            "required": True,
                            "type": "string",
                            "description": pv.get('description', '').replace('\n', '\\n')
                        })
                    
                    if parameters:
                        endpoint["parameters"] = parameters
                        
                    body = request.get('body', {})
                    if body.get('mode') == 'raw':
                        try:
                            raw_body = json.loads(body['raw'])
                            properties = {}
                            if isinstance(raw_body, dict):
                                for key, val in raw_body.items():
                                    properties[key] = {
                                        "type": type(val).__name__ if val is not None else "string",
                                        "example": val
                                    }
                                
                            endpoint["requestBody"] = {
                                "content": {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": properties
                                        },
                                        "example": raw_body
                                    }
                                }
                            }
                        except:
                            pass
                            
                    responses = []
                    for resp in item.get('response', []):
                        try:
                            resp_body = json.loads(resp['body']) if resp.get('body') else None
                            resp_obj = {
                                "status": resp.get('code', 200),
                                "description": resp.get('status', 'OK')
                            }
                            if resp_body is not None:
                                properties = {}
                                if isinstance(resp_body, dict):
                                    for key, val in resp_body.items():
                                        properties[key] = {
                                            "type": type(val).__name__ if val is not None else "string",
                                            "example": val
                                        }
                                
                                resp_obj["content"] = {
                                    "application/json": {
                                        "schema": {
                                            "type": "object",
                                            "properties": properties
                                        },
                                        "example": resp_body
                                    }
                                }
                            responses.append(resp_obj)
                        except:
                          responses.append({
                              "status": resp.get('code', 200),
                              "description": resp.get('status', 'OK')
                          })
                    
                    if responses:
                        endpoint["responses"] = responses
                        
                    endpoints.append(endpoint)
            return endpoints

        section['endpoints'] = process_items(top_level_item['item'])
        spec.append(section)
        
    return spec

if __name__ == "__main__":
    with open('postman.json', 'r') as f:
        pm_json = json.load(f)
    
    spec = convert_postman_to_spec(pm_json)
    
    ts_content = f"export const apiSpec: ApiSection[] = {json.dumps(spec, indent=2)};"
    
    # We need to read the types from the original file first
    with open('lib/api-spec.ts', 'r') as f:
        lines = f.readlines()
    
    type_definitions = []
    for line in lines:
        if line.startswith("export const apiSpec"):
            break
        type_definitions.append(line)
        
    with open('lib/api-spec.ts', 'w') as f:
        f.writelines(type_definitions)
        f.write("\n")
        f.write(ts_content)
        f.write("\n")
