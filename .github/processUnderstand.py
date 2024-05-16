OPERATORS = {
    "=":  lambda a, b : a == b,
    "<=": lambda a, b : a <= b,
    "<":  lambda a, b : a < b,
    ">=": lambda a, b : a >= b,
    ">":  lambda a, b : a > b
}

def threshold(categories: list, metric: str, threshold: list[str, int]) -> float:
    values = dict()
    for category in categories:
        for ind in category.index:
            val = category[metric][ind]
            name = category["Name"][ind]

            if type(val) == str:
                val = float(val.replace(',', '.'))
            
            values[name] = val

    if len(values) == 0:
        return 0.0, {}

    violatingFiles = dict()
    violations = 0
    op, t = threshold
    for name, val in values.items():
        if not OPERATORS[op](val, t):
            violations = violations + 1
            violatingFiles[name] = val    

    return violations / len(values), violatingFiles

def compute_percentages_understand(categories: dict, config: dict[str, dict]) -> dict[str, float]:
    percentages = dict()
    violatingFiles = dict()
    for key, val in config.items():
        dfs = [categories[t] for t in val['type'] if t in categories]
        percentages[key], violatingFiles[key] = threshold(dfs, val['metric'], val['threshold'])
    
    return percentages, violatingFiles